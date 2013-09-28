/*******************************************************************************
 * FPSTiming (version 0.9.50)
 * Copyright (c) 2013 Jean Pierre Charalambos.
 * @author Jean Pierre Charalambos
 * https://github.com/remixlab
 *   
 * All rights reserved. Library that eases the creation of interactive
 * scenes released under the terms of the GNU Public License v3.0
 * which is available at http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/
package remixlab.fpstiming;

/**
 * Interface defining the behavior animated objects should implement.
 */
public interface Animatable {
	/**
	 * Main call back animated method.
	 */
	void animate();

	/**
	 * Returns whether or not the animated method is defined externally, as
	 * when register it through reflection.
	 */
	boolean externalAnimation();

	/**
	 * Returns the animation period in milliseconds.
	 */
	long animationPeriod();

	/**
	 * Sets the animation period in milliseconds.
	 */
	void setAnimationPeriod(long period);

	/**
	 * Sets the animation period in milliseconds and restarts the
	 * animation according to {@code restar}.
	 */
	void setAnimationPeriod(long period, boolean restart);

	/**
	 * Stops the animation.
	 */
	void stopAnimation();

	/**
	 * Starts the animation executing periodically the animated call back method.
	 */
	void startAnimation();

	/**
	 * Simply calls {@link #stopAnimation()} and then {@link #startAnimation()}.
	 */
	void restartAnimation();

	/**
	 * Starts or stops the animation according to {@link #animationIsStarted()}.
	 */
	void toggleAnimation();

	/**
	 * Returns {@code true} if animation was started and {@code false} otherwise.
	 */
	boolean animationIsStarted();

	/**
	 * Sets the timing handler.
	 */
	void setTimingHandler(TimingHandler h);

	/**
	 * Returns the timing handler.
	 */
	TimingHandler timingHandler();

	/**
	 * Returns the sequential timer.
	 */
	SeqTimer timer();
}
